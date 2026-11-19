import { Exercice } from "../../../domain/entity/Exercice"
import { Performance } from "../../../domain/entity/Performance"
import { Muscle } from "../../../domain/entity/Muscle"
import { User } from "../../../domain/entity/User"

const muscle1 = new Muscle(1, "Biceps")
const muscle2 = new Muscle(2, "Triceps")
const muscle3 = new Muscle(3, "Pec")

const user = new User("Max", "max+test@gmail.com", "P@ssword1234")

const exercice = new Exercice("Curl Marteau", muscle1, muscle2, muscle3, user, false)

test("Performance Valide", () => {
    expect(new Performance(1, exercice, 100, 1, 1, 1)).toBeInstanceOf(Performance)
})

test("Performance Invalide duré en float pour time", () => {
    expect(() => new Performance(1, exercice, 100, 1, 1.1, 1)).toThrow("Les durées doivent être écritent en secondes entières")
})

test("Performance Invalide duré en float pour les deux", () => {
    expect(() => new Performance(1, exercice, 100, 1, 1, 1.1)).toThrow("Les durées doivent être écritent en secondes entières")
})

test("Performance Invalide duré en float pour rest", () => {
    expect(() => new Performance(1, exercice, 100, 1, 1.1, 1.1)).toThrow("Les durées doivent être écritent en secondes entières")
})