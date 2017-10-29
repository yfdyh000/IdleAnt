import { Unlocable } from '../utils';
import { Production } from '../production';
import { WorldInterface } from './worldInterface';
import { Unit } from '../units/unit';
import { GameModel } from '../gameModel';
import { BuyAction, BuyAndUnlockAction, UpAction, UpHire, UpSpecial, Research } from '../units/action';
import { Cost } from '../cost';
import { TypeList } from '../typeList';
import { BaseWorld } from './baseWorld';
import { Base } from '../units/base';

export class Researchs implements WorldInterface {

  up1: Research
  rDirt: Research
  upCombined: Research

  specialResearch: Research
  prestigeResearch: Research
  engineerRes: Research
  machineryRes: Research
  departmentRes: Research
  // stageRes: Research

  experimentResearch: Research
  composterResearch: Research
  refineryResearch: Research
  laserResearch: Research
  hydroResearch: Research
  planterResearch: Research

  scientificMethod: Research
  universityRes: Research
  publicLesson: Research
  advancedLesson: Research
  depEduRes: Research

  hereAndNow: Research
  adaptation: Research
  evolution: Research
  // devolution: Research
  escape: Research
  timeWarp: Research
  // missing: Research

  bi: Research

  constructor(public game: GameModel) { }

  public declareStuff() { }

  public initStuff() {

    //    Bi
    this.bi = new Research(
      "biResea",
      "Business Intelligence",
      "See who produce or consume your resources.",
      [new Cost(this.game.baseWorld.science, Decimal(2E3))],
      [],
      this.game
    )

    // //   Devolution
    // this.devolution = new Research(
    //   "devoluti",
    //   "De-Evolution",
    //   "Revert the effect of evolution.",
    //   [new Cost(this.game.baseWorld.science, Decimal(1))],
    //   [],
    //   this.game,
    //   () => {
    //     this.game.world.toUnlock.forEach(t => t.basePrice = t.basePrice.div(5))
    //     this.game.world.experience = this.game.world.experience.div(3)
    //   }
    // )

    //    Evolution
    this.evolution = new Research(
      "evolution",
      "Evolution",
      "Increase the resources need to travel to a new world (x5) and also increase the experience you will gain (x3).",
      [new Cost(this.game.baseWorld.science, Decimal(1E10))],
      [],
      this.game,
      () => {
        this.game.world.toUnlock.forEach(t => t.basePrice = t.basePrice.times(5))
        this.game.world.experience = this.game.world.experience.times(3)
      }
    )

    //    Missing
    // this.missing = new Research(
    //   "missing",
    //   "Missing", "Get 50% of missing world travel requirement.",
    //   [new Cost(this.game.baseWorld.science, Decimal(2E11))],
    //   [],
    //   this.game,
    //   () => {
    //     this.game.world.toUnlock.filter(t => t.basePrice.greaterThan(t.unit.quantity))
    //       .forEach(t => t.unit.quantity = t.unit.quantity.plus(
    //         t.basePrice.minus(t.unit.quantity).div(2)
    //       ))
    //   }
    // )

    //    Escape
    this.escape = new Research(
      "escapism",
      "Escapism", "Reduce the resources need to travel to a new world by 50%.",
      [new Cost(this.game.baseWorld.science, Decimal(5E10))],
      [],
      this.game,
      () => {
        this.game.world.toUnlock.forEach(t => t.basePrice = t.basePrice.div(2))
        // this.game.world.toUnlockMax.forEach(t => t.basePrice = t.basePrice.times(4))
      }
    )

    //    Adaptation
    this.adaptation = new Research(
      "adaptation",
      "Adaptation", "Reduce the resources need to travel to a new world by 50%.",
      [new Cost(this.game.baseWorld.science, Decimal(5E8))],
      [this.escape],
      this.game,
      () => {
        this.game.world.toUnlock.forEach(t => t.basePrice = t.basePrice.div(2))
        //   this.game.world.toUnlockMax.forEach(t => t.basePrice = t.basePrice.times(4))
      }
    )

    //  Time Warp
    this.timeWarp = new Research(
      "timeWarp",
      "Time warp", "4 hour of update. Use it use it wisely.",
      [new Cost(this.game.baseWorld.science, Decimal(1))],
      [],
      this.game,
      () => {
        this.game.longUpdate(3600 * 4000, true)
      }
    )

    //    Here and Now
    this.hereAndNow = new Research(
      "hereAndNow",
      "此时此地", "获得10经验。",
      [new Cost(this.game.baseWorld.science, Decimal(1E9))],
      [this.timeWarp],
      this.game,
      () => {
        this.game.prestige.experience.quantity = this.game.prestige.experience.quantity.plus(10)
        this.game.maxLevel = this.game.maxLevel.plus(10)
        this.game.expTabAv = true
      }
    )

    //    University 4
    this.depEduRes = new Research(
      "depEduRes",
      "教育部门", "解锁教育部。",
      [new Cost(this.game.baseWorld.science, Decimal(3E10))],
      [this.game.science.depEdu],
      this.game
    )

    //    University 3
    this.advancedLesson = new Research(
      "advancedLesson",
      "高级课程", "大学也生产科学家。",
      [new Cost(this.game.baseWorld.science, Decimal(3E6))],
      [this.game.science.scientistProduction, this.depEduRes],
      this.game
    )

    //    University 2
    this.publicLesson = new Research(
      "publicLesson",
      "Public Lesson", "University also produces students.",
      [new Cost(this.game.baseWorld.science, Decimal(1E5))],
      [this.game.science.studentProduction, this.advancedLesson],
      this.game
    )

    //    University
    this.universityRes = new Research(
      "University",
      "University", "Unlock university.",
      [new Cost(this.game.baseWorld.science, Decimal(6E4))],
      [this.game.science.university, this.publicLesson],
      this.game
    )

    //    Scientific Method
    this.scientificMethod = new Research(
      "scientificMethod",
      "Scientific Method", "Science production +100%",
      [new Cost(this.game.baseWorld.science, Decimal(4E3))],
      [this.universityRes],
      this.game
    )
    this.game.baseWorld.science.bonusProduction.push([this.scientificMethod, Decimal(1)])

    // //    Stage
    // this.stageRes = new Research(
    //   "stageRes",
    //   "Stage", "Stage.",
    //   [new Cost(this.game.baseWorld.science, Decimal(3E6))],
    //   this.game.machines.stageList,
    //   this.game
    // )

    const deps: Array<Unlocable> = this.game.engineers.listDep
    this.departmentRes = new Research(
      "departementsRes",
      "Departments", "Departments yeild engineers.",
      [new Cost(this.game.baseWorld.science, Decimal(1E11))],
      deps,
      this.game
    )

    //    Engineer
    const eng: Array<Unlocable> = this.game.engineers.listEnginer
    // //eng.push(this.stageRes)
    this.engineerRes = new Research(
      "engineerRes",
      "Engineer", "Engineer will slowly build machinery.",
      [new Cost(this.game.baseWorld.science, Decimal(3E6))],
      eng.concat(this.departmentRes),
      this.game
    )

    //    Planter
    this.planterResearch = new Research(
      "planRes",
      "Planting", "Tree planting is the process of transplanting tree seedlings.",
      [new Cost(this.game.baseWorld.science, Decimal(1E4))],
      [this.game.baseWorld.planterAnt],
      this.game
    )

    //    Hydro
    this.hydroResearch = new Research(
      "hydroRes",
      "Hydroponics", "Hydroponics is the art of growing plants without soil.",
      [new Cost(this.game.baseWorld.science, Decimal(1E4))],
      [this.game.baseWorld.hydroAnt],
      this.game
    )

    //    Laser
    this.laserResearch = new Research(
      "lasRes",
      "激光", "沙子可以融合成水晶。",
      [new Cost(this.game.baseWorld.science, Decimal(1E4))],
      [this.game.baseWorld.laserAnt],
      this.game
    )

    //    Refinery
    this.refineryResearch = new Research(
      "refRes",
      "精炼厂", "土壤可以精制成沙子。",
      [new Cost(this.game.baseWorld.science, Decimal(1E4))],
      [this.game.baseWorld.refineryAnt],
      this.game
    )

    //    Compost
    this.composterResearch = new Research(
      "compRes",
      "Compost", "Wood can be degraded to fertile soil.",
      [new Cost(this.game.baseWorld.science, Decimal(1E4))],
      [this.game.baseWorld.composterAnt],
      this.game
    )

    //    Experiment
    this.experimentResearch = new Research(
      "experimentRes",
      "Experiment", "Unlock scientist Ant",
      [new Cost(this.game.baseWorld.science, Decimal(800))],
      [this.game.science.scientist, this.scientificMethod],
      this.game
    )

    //    Prestige
    this.prestigeResearch = new Research(
      "prestigeRes",
      "Travel", "Allow you to move to new worlds",
      [new Cost(this.game.baseWorld.science, Decimal(1E7))],
      [this.hereAndNow, this.adaptation, this.evolution],
      this.game,
      () => { this.game.worldTabAv = true }
    )

    //    Machinery
    let listM = new Array<Base>()
    listM = listM.concat(this.game.machines.listMachinery, [this.engineerRes])
    this.machineryRes = new Research(
      "machiRes",
      "Machinery", "Unlock powerful machinery.",
      [new Cost(this.game.baseWorld.science, Decimal(1E6))],
      listM,
      this.game
    )

    //    Special
    this.specialResearch = new Research(
      "speRes",
      "Technology", "Allow you to research new technologies.",
      [new Cost(this.game.baseWorld.science, Decimal(3E3))],
      [this.composterResearch, this.refineryResearch, this.laserResearch, this.hydroResearch,
      this.planterResearch, this.experimentResearch,
      this.machineryRes, this.prestigeResearch,
      this.bi],
      this.game
    )

    //    Up Combined
    this.upCombined = new Research(
      "upComb",
      "Combined bonus", "This is the ultimate bonus: multiply unit's bonus per hire bonus.",
      [new Cost(this.game.baseWorld.science, Decimal(1E10))],
      [],
      this.game
    )

    //    Up Hire
    const allUpH = Array.from(this.game.unitMap.values()).filter(u => u.upHire).map(u => u.upHire)
    allUpH.push(this.upCombined)
    const r4 = new Research(
      "R4",
      "双胞胎", "允许您以相同的价格获得更多的单位。",
      [new Cost(this.game.baseWorld.science, Decimal(7E3))],
      allUpH,
      this.game
    )

    //    Up 2
    const allUp = Array.from(this.game.unitMap.values()).filter(u => u.upAction).map(u => u.upAction)
    allUp.push(r4)
    const r2 = new Research(
      "R2",
      "团队合作2", "升级您的单位生产加成。",
      [new Cost(this.game.baseWorld.science, Decimal(500))],
      allUp,
      this.game
    )

    //    Up basic
    this.up1 = new Research(
      "RUp1",
      "团队合作", "根据您购买单位的次数提供生产加成。",
      [new Cost(this.game.baseWorld.science, Decimal(50))],
      [r2],
      this.game
    )

    //    Hunter 2
    const hunting2 = new Research(
      "HuntR2",
      "高级狩猎", "蚂蚁装备更好的武器。",
      [new Cost(this.game.baseWorld.science, Decimal(4000))],
      [this.game.baseWorld.advancedHunter], this.game
    )

    //    Hunter
    const hunting = new Research(
      "HuntR1",
      "狩猎", "用武器装备蚂蚁以获得食物。",
      [new Cost(this.game.baseWorld.science, Decimal(2000))],
      [this.game.baseWorld.hunter, hunting2, this.specialResearch], this.game
    )

    //    Wood
    const woodcutting = new Research(
      "WR1",
      "伐木", "允许您收集木材以备将来使用。",
      [new Cost(this.game.baseWorld.science, Decimal(1000))],
      [this.game.baseWorld.lumberjack, hunting], this.game
    )

    //    Fungus up
    const r3 = new Research(
      "R3",
      "真菌实验", "允许你通过做实验来增加真菌的食物生产。",
      [new Cost(this.game.baseWorld.science, Decimal(1000))],
      [this.game.baseWorld.fungus.upSpecial], this.game
    )

    //    Farming
    const r1 = new Research(
      "R1",
      "蚂蚁的真菌共生", "让你培养真菌。 真菌是食物的来源。",
      [new Cost(this.game.baseWorld.science, Decimal(100))],
      [this.game.baseWorld.farmer, r3, woodcutting], this.game
    )

    //    Soil
    this.rDirt = new Research(
      "RDirt",
      "土壤", "允许您收集土壤以备将来使用。",
      [new Cost(this.game.baseWorld.science, Decimal(50))],
      [this.game.baseWorld.soil, this.game.baseWorld.carpenter, r1, this.up1], this.game
    )

  }

  public addWorld() {
  }
}
