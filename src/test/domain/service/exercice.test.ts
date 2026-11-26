import { Exercice, makeExerciceFaker } from "../../../Domain/Entity/Exercice";
import { makeMuscleFaker } from "../../../Domain/Entity/Muscle";
import { makeUserFaker } from "../../../Domain/Entity/User";
import { ExerciceService } from "../../../Domain/Service/DExerciceService";

const muscle1 = makeMuscleFaker({id: 1});
const muscle2 = makeMuscleFaker({id: 2});
const user = makeUserFaker();

const exerciceService = new ExerciceService();

test("Test can create exercice valide pour publique", () => {
  expect(exerciceService.canCreateExercice(makeExerciceFaker()));
});

test("Test can create exercice valide pour privé", () => {
  expect(exerciceService.canCreateExercice(makeExerciceFaker({name: "Curl Marteau putain", is_public: false})));
});

test("Test can create exercice invalide name avec injure", () => {
  expect(() => exerciceService.canCreateExercice(makeExerciceFaker({name: "Curl Marteau putain", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});

test("Test can create exercice invalide name avec Maj injure", () => {
  expect(() => exerciceService.canCreateExercice(makeExerciceFaker({name: "Curl Marteau Putain", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});

test("Test can update exercice valide pour publique", () => {
  expect(exerciceService.canUpdateExercice(makeExerciceFaker()));
});

test("Test can update exercice valide pour privé", () => {
  expect(exerciceService.canUpdateExercice(makeExerciceFaker({name: "Curl Marteau putain", is_public: false})));
});

test("Test can update exercice invalide name avec injure", () => {
  expect(() => exerciceService.canUpdateExercice(makeExerciceFaker({name: "Curl Marteau putain", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});

test("Test can update exercice invalide name avec Maj injure", () => {
  expect(() => exerciceService.canUpdateExercice(makeExerciceFaker({name: "Curl Marteau Putain", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});
