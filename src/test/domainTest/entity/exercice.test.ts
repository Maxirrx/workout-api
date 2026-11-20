import { Exercice } from "../../../Domain/Entity/Exercice"
import { Muscle } from "../../../Domain/Entity/Muscle"
import { User } from "../../../Domain/Entity/User"

const muscle1 = new Muscle(1, "Biceps")
const muscle2 = new Muscle(2, "Triceps")
const muscle3 = new Muscle(3, "Pec")
const user = new User("Max", "max+test@gmail.com", "P@ssword1234")

test("Test ajout exercice valide avec 3 muscles", () => {
    expect(new Exercice("Curl Marteau", muscle1, muscle2, muscle3, user, false)).toBeInstanceOf(Exercice)
})

test("Test ajout exercice valide avec 2 muscles", () => {
    expect(new Exercice("Curl Marteau", muscle1, muscle2, undefined, user, false)).toBeInstanceOf(Exercice)
})

test("Test ajout exercice valide avec un seul muscle", () => {
    expect(new Exercice("Curl Marteau", muscle1, undefined, undefined, user, false)).toBeInstanceOf(Exercice)
})

test("Test ajout exercice invalide doublons muscle 1 et 2", () => {
    expect(() => new Exercice("Curl Marteau", muscle1, muscle1, muscle3, user, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})

test("Test ajout exercice invalide doublons muscle 2 et 3", () => {
    expect(() => new Exercice("Curl Marteau", muscle2, muscle1, muscle1, user, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})

test("Test ajout exercice invalide triplon muscle", () => {
    expect(() => new Exercice("Curl Marteau", muscle1, muscle1, muscle1, user, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})

test("Test ajout exercice invalide doublons muscle plus undefined 2", () => {
    expect(() => new Exercice("Curl Marteau", muscle1, undefined, muscle1, user, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})

test("Test ajout exercice invalide doublons muscle undefined 3", () => {
    expect(() => new Exercice("Curl Marteau", muscle1, muscle1, undefined, user, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})
