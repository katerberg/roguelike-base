import * as Phaser from 'phaser';
import {CELL_WIDTH} from '../types/constants';
import {TileOption} from '../types/sharedTypes';

export class Player extends Phaser.Physics.Arcade.Sprite {
  hp;

  constructor({scene, x, y, hp}: {scene: Phaser.Scene; x: number; y: number; hp: number}) {
    super(scene, x * CELL_WIDTH, y * CELL_WIDTH, 'batch1', TileOption.Player);

    this.hp = hp;

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
  // handleActions(currentTime, keys) {
  // }

  // handleMovement(timeAwareOfPauses, keys) {
  //   const {up, down, left, right, w, s, a, d, q, e} = keys;
  //   const isRunning = this.runWalk === RUN_WALK.STATE.RUNNING;

  //   const moveSpeed = isRunning ? PLAYER.RUN_SPEED : PLAYER.SPEED;
  //   const forwardMove = up.isDown || w.isDown;
  //   const backwardMove = down.isDown || s.isDown;
  //   const leftStrafe = q.isDown;
  //   const rightStrafe = e.isDown;
  //   const leftRotate = left.isDown || a.isDown;
  //   const rightRotate = right.isDown || d.isDown;
  //   let moveVector = {x: forwardMove ? 1 : backwardMove ? -1 : 0, y: leftStrafe ? -1 : rightStrafe ? 1 : 0};
  //   if (moveVector.x || moveVector.y) {
  //     if (isRunning && !this.footstepsSound) {
  //       this.footstepsSound = this.scene.sound.play('footsteps', {rate: 3, loop: true});
  //     }
  //     if (!isRunning && this.footstepsSound) {
  //       this.scene.sound.stopByKey('footsteps');
  //       this.footstepsSound = null;
  //     }
  //     moveVector = getNormalized(moveVector);
  //     moveVector.x *= moveSpeed;
  //     moveVector.y *= moveSpeed;
  //     if (timeAwareOfPauses > this.lastStep + (isRunning ? PLAYER.RUN_SOUND_DELAY : PLAYER.WALK_SOUND_DELAY)) {
  //       this.lastStep = timeAwareOfPauses;
  //       this.scene.addSoundWave(this.x, this.y, isRunning ? PLAYER.RUN_SOUND_RADIUS : PLAYER.WALK_SOUND_RADIUS);
  //     }
  //   } else if (this.footstepsSound) {
  //     this.scene.sound.stopByKey('footsteps');
  //     this.footstepsSound = null;
  //   }
  //   const runWalkMultiplier = isRunning ? 1.75 : 1;
  //   const angularMultiplier = leftRotate ? -1 : rightRotate ? 1 : 0;
  //   this.body.setVelocity(
  //     moveVector.x * Math.cos(this.rotation) - moveVector.y * Math.sin(this.rotation),
  //     moveVector.x * Math.sin(this.rotation) + moveVector.y * Math.cos(this.rotation),
  //   );

  //   const camera = this.scene.cameras.main.setRotation(Phaser.Math.DegToRad(this.angle + 90) * -1);
  //   if (isDebug()) {
  //     camera.setZoom(0.5);
  //   }
  //   this.body.setAngularVelocity(angularMultiplier * PLAYER.ANGLE_SPEED * runWalkMultiplier);

  //   this.legs.setAngle(this.angle); //Where we're going, we don't need legs (⌐■_■)
  //   this.legs.moveTo(this.body.x, this.body.y);
  // }

  // handleInput(timeAwareOfPauses) {
  //   const keys = this.scene.scene.get(SCENES.HUD).playerKeys;
  //   this.handleMovement(timeAwareOfPauses, keys);
  //   this.handleActions(timeAwareOfPauses, keys);
  // }
}
