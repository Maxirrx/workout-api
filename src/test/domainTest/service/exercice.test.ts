import { Exercice } from "../../../Domain/Entity/Exercice"
import { Muscle } from "../../../Domain/Entity/Muscle"
import { User } from "../../../Domain/Entity/User"
import { ExerciceService } from "../../../Domain/Service/ExerciceService"

const muscle1 = new Muscle(1, "Biceps")
const muscle2 = new Muscle(2, "Triceps")

const user = new User("Max", "max+test@gmail.com", "P@ssword1234")

const exerciceService = new ExerciceService()

test("Test can create exercice valide pour public", () => {
    expect(exerciceService.canCreateExercice(new Exercice("Curl Marteau", muscle1, muscle2, undefined, user, true)))
})

test("Test can create exercice valide pour privé", () => {
    expect(exerciceService.canCreateExercice(new Exercice("Curl Marteau putain", muscle1, muscle2, undefined, user, false)))
})


test("Test can create exercice invalide name with injure", () => {
    expect(() => exerciceService.canCreateExercice(new Exercice("Curl Marteau putain", muscle1, muscle2, undefined, user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})

test("Test can create exercice invalide name with Maj injure", () => {
    expect(() => exerciceService.canCreateExercice(new Exercice("Curl Marteau Putain", muscle1, muscle2, undefined, user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})

test("Test can update exercice valide pour public", () => {
    expect(exerciceService.canUpdateExercice(new Exercice("Curl Marteau", muscle1, muscle2, undefined, user, true)))
})

test("Test can update exercice valide pour privé", () => {
    expect(exerciceService.canUpdateExercice(new Exercice("Curl Marteau putain", muscle1, muscle2, undefined, user, false)))
})

test("Test can update exercice invalide name with injure", () => {
    expect(() => exerciceService.canUpdateExercice(new Exercice("Curl Marteau putain", muscle1, muscle2, undefined, user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})

test("Test can update exercice invalide name with Maj injure", () => {
    expect(() => exerciceService.canUpdateExercice(new Exercice("Curl Marteau Putain", muscle1, muscle2, undefined, user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})