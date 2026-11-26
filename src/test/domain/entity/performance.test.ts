import { makeExerciceFaker } from "../../../Domain/Entity/Exercice";
import { makePerformanceFaker, Performance } from "../../../Domain/Entity/Performance";

const exercice = makeExerciceFaker();

test("Performance Valide", () => {
  expect(makePerformanceFaker()).toBeInstanceOf(Performance);
});

test("Performance Invalide duré en float pour time", () => {
  expect(() => makePerformanceFaker({time: 1.1})).toThrow("Les durées doivent être écrites en secondes entières");
});

test("Performance Invalide duré en float pour les deux", () => {
  expect(() => makePerformanceFaker({rest: 1.1})).toThrow("Les durées doivent être écrites en secondes entières");
});

test("Performance Invalide duré en float pour rest", () => {
  expect(() => makePerformanceFaker({time : 1.1, rest: 1.1})).toThrow("Les durées doivent être écrites en secondes entières");
});
