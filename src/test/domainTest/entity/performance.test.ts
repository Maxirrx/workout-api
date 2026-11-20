import { makeExerciceFaker } from "../../../Domain/Entity/Exercice"
import { Performance } from "../../../Domain/Entity/Performance"

const exercice = makeExerciceFaker()

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