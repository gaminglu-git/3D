import { BuildingElement } from '../types/building'
import { Euler, Quaternion } from 'three'
import { isFloorElement, isRoofElement, isWall } from '../types/building'
import { PhysicsCommand, PhysicsCommandType } from './types'

type Rapier = typeof import('@dimforge/rapier3d-compat')

export class PhysicsService {
  private static instance: PhysicsService
  private RAPIER: Rapier | null = null
  public world: any = null
  private isInitialized = false
  private colliderMap = new Map<string, any>()
  private jointMap = new Map<number, any>()
  private commandQueue: PhysicsCommand[] = []
  private isProcessingQueue = false

  private constructor() {}

  public static getInstance(): PhysicsService {
    if (!PhysicsService.instance) {
      PhysicsService.instance = new PhysicsService()
    }
    return PhysicsService.instance
  }

  public async init(): Promise<void> {
    // Only initialize in the browser
    if (typeof window === 'undefined') {
      console.log('Skipping physics initialization on server')
      return
    }
    
    if (this.isInitialized) {
      console.log('Physics service already initialized')
      return
    }

    try {
      console.log('Starting physics service initialization...')
      
      // Dynamically import Rapier
      console.log('Importing Rapier module...')
      this.RAPIER = await import('@dimforge/rapier3d-compat')
      console.log('Rapier module imported successfully')
      
      // Initialize Rapier WASM
      console.log('Initializing Rapier WASM...')
      await this.RAPIER.init()
      console.log('Rapier WASM initialized successfully')
      
      // Create physics world
      console.log('Creating physics world...')
      const gravity = new this.RAPIER.Vector3(0.0, -9.81, 0.0)
      this.world = new this.RAPIER.World(gravity)
      console.log('Physics world created successfully')
      
      this.isInitialized = true
      console.log('Physics service initialized successfully')
    } catch (error) {
      console.error('CRITICAL: Physics WASM module initialization failed.', error)
      // Reset state on failure
      this.RAPIER = null
      this.world = null
      this.isInitialized = false
      throw error
    }
  }

  public Rapier(): Rapier | null {
    return this.RAPIER
  }

  public addCommand(command: PhysicsCommand) {
    this.commandQueue.push(command)
    this.processQueue()
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || typeof window === 'undefined') return
    if (!this.isInitialized || !this.RAPIER || !this.world) {
      console.log('Physics service not ready, queue processing deferred.')
      return
    }

    this.isProcessingQueue = true

    try {
      while (this.commandQueue.length > 0) {
        const command = this.commandQueue.shift()
        if (!command) continue

        switch (command.type) {
          case PhysicsCommandType.ADD:
            if (command.element) {
              this.createColliderForElement(command.element)
            }
            break
          case PhysicsCommandType.REMOVE:
            this.removeCollider(command.elementId)
            break
          // ... other cases like UPDATE would be handled here
        }
      }
    } finally {
      this.isProcessingQueue = false
    }
  }

  private createColliderForElement(element: BuildingElement): void {
    try {
      if (isWall(element)) {
        this.createWallCollider(element)
      } else if (isFloorElement(element)) {
        this.createFloorCollider(element)
      } else if (isRoofElement(element)) {
        this.createRoofCollider(element)
      }
    } catch (error) {
      console.error(`Failed to create collider for element ${element.id}:`, error)
    }
  }

  private removeCollider(elementId: string): void {
    const collider = this.colliderMap.get(elementId)
    if (collider) {
      this.world.removeCollider(collider, false)
      this.colliderMap.delete(elementId)
    }
  }

  public async syncWithBuilding(elements: BuildingElement[]): Promise<void> {
    // Only run in the browser
    if (typeof window === 'undefined') return
    
    if (!this.isInitialized || !this.RAPIER || !this.world) {
      console.log('Physics service not ready for sync')
      return
    }

    console.log(`Syncing physics with ${elements.length} building elements`)

    const newElementIds = new Set(elements.map((e) => e.id))
    const oldElementIds = new Set(this.colliderMap.keys())

    // Remove colliders for elements that no longer exist
    oldElementIds.forEach((id) => {
      if (!newElementIds.has(id)) {
        this.addCommand({ type: PhysicsCommandType.REMOVE, elementId: id })
      }
    })

    // Add or update colliders for current elements
    elements.forEach((element) => {
      if (!oldElementIds.has(element.id)) {
        this.addCommand({ type: PhysicsCommandType.ADD, elementId: element.id, element })
      } else {
        // TODO: Implement update logic if necessary (e.g., for moving objects)
      }
    })

    console.log(`Physics sync completed with ${this.colliderMap.size} colliders`)
  }

  private createWallCollider(element: any): void {
    if (!this.RAPIER || !this.world) return

    try {
      const bodyDesc = this.RAPIER.RigidBodyDesc.fixed()
        .setTranslation(element.position.x, element.position.y, element.position.z)
        .setRotation(new Quaternion().setFromEuler(new Euler(0, element.rotation.y, 0)))

      const body = this.world.createRigidBody(bodyDesc)

      const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
        element.dimensions.width / 2,
        element.dimensions.height / 2,
        element.dimensions.depth / 2,
      )

      const collider = this.world.createCollider(colliderDesc, body)
      this.colliderMap.set(element.id, collider)
    } catch (error) {
      console.error(`Failed to create wall collider for element ${element.id}:`, error)
    }
  }

  private createFloorCollider(element: any): void {
    if (!this.RAPIER || !this.world) return;

    try {
      const { width, height, depth } = element.dimensions;
      if (width < 0.01 || height < 0.01 || depth < 0.01) {
        console.error(`[Physics] Invalid dimensions for floor ${element.id}:`, element.dimensions);
        return;
      }
      console.log(`[Physics] Creating floor collider for ${element.id} with dimensions:`, { width, height, depth });


      const bodyDesc = this.RAPIER.RigidBodyDesc.kinematicPositionBased()
        .setTranslation(element.position.x, element.position.y, element.position.z);

      const body = this.world.createRigidBody(bodyDesc);

      const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
        element.dimensions.width / 2,
        element.dimensions.height / 2,
        element.dimensions.depth / 2,
      )

      const collider = this.world.createCollider(colliderDesc, body)
      this.colliderMap.set(element.id, collider)
    } catch (error) {
      console.error(`Failed to create floor collider for element ${element.id}:`, error)
    }
  }

  private createRoofCollider(element: any): void {
    if (!this.RAPIER || !this.world) return;

    try {
      const { width, height, depth } = element.dimensions;
      if (width < 0.01 || height < 0.01 || depth < 0.01) {
        console.error(`[Physics] Invalid dimensions for roof ${element.id}:`, element.dimensions);
        return;
      }
      console.log(`[Physics] Creating roof collider for ${element.id} with dimensions:`, { width, height, depth });

      const bodyDesc = this.RAPIER.RigidBodyDesc.kinematicPositionBased()
        .setTranslation(element.position.x, element.position.y, element.position.z);

      const body = this.world.createRigidBody(bodyDesc);

      const colliderDesc = this.RAPIER.ColliderDesc.cuboid(
        element.dimensions.width / 2,
        element.dimensions.height / 2,
        element.dimensions.depth / 2,
      )

      const collider = this.world.createCollider(colliderDesc, body)
      this.colliderMap.set(element.id, collider)
    } catch (error) {
      console.error(`Failed to create roof collider for element ${element.id}:`, error)
    }
  }

  public getCollisions(): any[] {
    if (!this.isInitialized || !this.world) return []
    
    // Simple collision detection - in a real implementation, this would be more sophisticated
    return []
  }

  public setGravity(enabled: boolean): void {
    if (!this.isInitialized || !this.RAPIER || !this.world) return
    
    if (enabled) {
      this.world.gravity = new this.RAPIER.Vector3(0.0, -9.81, 0.0)
    } else {
      this.world.gravity = new this.RAPIER.Vector3(0.0, 0.0, 0.0)
    }
  }

  public setBodyType(elementId: string, isDynamic: boolean): void {
    if (!this.isInitialized || !this.RAPIER || !this.world) return
    
    const collider = this.colliderMap.get(elementId)
    const body = collider?.parent()
    if (body) {
      body.setBodyType(
        isDynamic ? this.RAPIER.RigidBodyType.Dynamic : this.RAPIER.RigidBodyType.Fixed,
        true
      )
    }
  }

  public getDebugRenderBuffers(): { vertices: Float32Array; colors: Uint8Array } | null {
    if (!this.isInitialized || !this.world) return null
    
    // Simple debug rendering - return empty buffers for now
    return {
      vertices: new Float32Array(0),
      colors: new Uint8Array(0)
    }
  }

  public addJoint(body1Handle: number, body2Handle: number, anchor1: any, anchor2: any): number | null {
    if (!this.isInitialized || !this.RAPIER || !this.world) return null
    
    const body1 = this.world.getRigidBody(body1Handle)
    const body2 = this.world.getRigidBody(body2Handle)
    
    if (!body1 || !body2) return null
    
    // Simple fixed joint for now - return a mock handle
    const handle = Date.now() // Simple unique handle
    this.jointMap.set(handle, { body1, body2 })
    
    return handle
  }

  public removeJoint(jointHandle: number): void {
    if (!this.isInitialized || !this.world) return
    
    const joint = this.jointMap.get(jointHandle)
    if (joint) {
      this.world.removeImpulseJoint(joint, true)
      this.jointMap.delete(jointHandle)
    }
  }

  public step(): void {
    if (!this.isInitialized || !this.world) return;
    this.world.step();
  }

  public getSnapPoints(): { x: number; y: number; z: number }[] {
    if (!this.isInitialized || !this.world) return []
    
    const snapPoints: { x: number; y: number; z: number }[] = []
    
    // Get positions from all fixed rigid bodies in the colliderMap
    this.colliderMap.forEach((collider) => {
      const body = collider.parent()
      if (body && body.isFixed()) {
        const translation = body.translation()
        snapPoints.push({
          x: translation.x,
          y: translation.y,
          z: translation.z
        })
      }
    })
    
    return snapPoints
  }

  public destroy(): void {
    if (!this.isInitialized) return;
    
    console.log('Destroying physics service...')
    
    // Clear all colliders
    this.colliderMap.forEach((collider) => {
      if (this.world) {
        this.world.removeCollider(collider, false)
      }
    })
    this.colliderMap.clear()
    
    // Clear all joints
    this.jointMap.clear()
    
    // Reset state
    this.world = null
    this.RAPIER = null
    this.isInitialized = false
    
    console.log('Physics service destroyed')
  }
}

export const physicsService = PhysicsService.getInstance()






