import { Exercice } from "../../domain/entity/Exercice"

test("Test ajout exercice valide", () => {
    expect(new Exercice("Curl Marteau", 1, 2, 3, 1, false)).toBeInstanceOf(Exercice)
})

test("Test ajout exercice valide", () => {
    expect(() => new Exercice("Curl Marteau", 1, 1, 3, 1, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})

test("Test ajout exercice valide", () => {
    expect(() => new Exercice("Curl Marteau", 2, 1, 1, 1, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})

test("Test ajout exercice valide", () => {
    expect(() => new Exercice("Curl Marteau", 1, 1, 1, 1, false)).toThrow("Vous ne pouvez pas mettre le même muscle plusieur fois sur un exercice")
})
