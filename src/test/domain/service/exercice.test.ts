import { Exercice } from "../../../Domain/Entity/Exercice";
import { makeMuscleFaker } from "../../../Domain/Entity/Muscle";
import { makeUserFaker } from "../../../Domain/Entity/User";
import { ExerciceService } from "../../../Domain/Service/DExerciceService";

const muscle1 = makeMuscleFaker(1);
const muscle2 = makeMuscleFaker(2);

const user = makeUserFaker();

const exerciceService = new ExerciceService();

test("Test can create exercice valide pour public", () => {
  expect(exerciceService.canCreateExercice(new Exercice(1, "Curl Marteau", muscle1, muscle2, undefined, user, true)));
});

test("Test can create exercice valide pour privé", () => {
  expect(exerciceService.canCreateExercice(new Exercice(1, "Curl Marteau putain", muscle1, muscle2, undefined, user, false)));
});

test("Test can create exercice invalide name avec injure", () => {
  expect(() => exerciceService.canCreateExercice(new Exercice(1, "Curl Marteau putain", muscle1, muscle2, undefined, user, true))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource public"
  );
});

test("Test can create exercice invalide name avec Maj injure", () => {
  expect(() => exerciceService.canCreateExercice(new Exercice(1, "Curl Marteau Putain", muscle1, muscle2, undefined, user, true))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource public"
  );
});

test("Test can update exercice valide pour public", () => {
  expect(exerciceService.canUpdateExercice(new Exercice(1, "Curl Marteau", muscle1, muscle2, undefined, user, true)));
});

test("Test can update exercice valide pour privé", () => {
  expect(exerciceService.canUpdateExercice(new Exercice(1, "Curl Marteau putain", muscle1, muscle2, undefined, user, false)));
});

test("Test can update exercice invalide name avec injure", () => {
  expect(() => exerciceService.canUpdateExercice(new Exercice(1, "Curl Marteau putain", muscle1, muscle2, undefined, user, true))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource public"
  );
});

test("Test can update exercice invalide name avec Maj injure", () => {
  expect(() => exerciceService.canUpdateExercice(new Exercice(1, "Curl Marteau Putain", muscle1, muscle2, undefined, user, true))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource public"
  );
});
