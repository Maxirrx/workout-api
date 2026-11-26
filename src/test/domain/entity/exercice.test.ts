import { Exercice, makeExerciceFaker } from "../../../Domain/Entity/Exercice";
import { makeMuscleFaker, Muscle } from "../../../Domain/Entity/Muscle";
import { makeUserFaker, User } from "../../../Domain/Entity/User";

const muscle1 = makeMuscleFaker({id: 1});
const muscle2 = makeMuscleFaker({id: 2});
const muscle3 = makeMuscleFaker({id: 3});
const user = makeUserFaker();

test("Test ajout exercice valide avec 3 muscles", () => {
  expect(makeExerciceFaker({muscle_1: muscle1, muscle_2: muscle2, muscle_3: muscle3})).toBeInstanceOf(Exercice);
});

test("Test ajout exercice valide avec 2 muscles", () => {
  expect(makeExerciceFaker({muscle_1: muscle1, muscle_2: muscle2, muscle_3: undefined})).toBeInstanceOf(Exercice);
});

test("Test ajout exercice valide avec un seul muscle", () => {
  expect(makeExerciceFaker({muscle_1: muscle1, muscle_2: undefined, muscle_3: undefined})).toBeInstanceOf(Exercice);
});

test("Test ajout exercice invalide doublons muscle 1 et 2", () => {
  expect(() => makeExerciceFaker({muscle_1: muscle1, muscle_2: muscle1, muscle_3: muscle3})).toThrow("Vous ne pouvez pas mettre le même muscle plusieurs fois sur un exercice");
});

test("Test ajout exercice invalide doublons muscle 2 et 3", () => {
  expect(() => makeExerciceFaker({muscle_1: undefined, muscle_2: muscle2, muscle_3: muscle2})).toThrow("Vous ne pouvez pas mettre le même muscle plusieurs fois sur un exercice");
});

test("Test ajout exercice invalide triplon muscle", () => {
  expect(() => makeExerciceFaker({muscle_1: muscle2, muscle_2: muscle2, muscle_3: muscle2})).toThrow("Vous ne pouvez pas mettre le même muscle plusieurs fois sur un exercice");
});

test("Test ajout exercice invalide doublons muscle plus undefined 2", () => {
  expect(() => makeExerciceFaker({muscle_1: muscle2, muscle_2: undefined, muscle_3: muscle2})).toThrow("Vous ne pouvez pas mettre le même muscle plusieurs fois sur un exercice");
});

test("Test ajout exercice invalide doublons muscle undefined 3", () => {
  expect(() => makeExerciceFaker({muscle_1: muscle1, muscle_2: muscle1, muscle_3: undefined})).toThrow("Vous ne pouvez pas mettre le même muscle plusieurs fois sur un exercice");
});
