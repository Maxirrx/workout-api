import { makeExerciceFaker } from "../../../Domain/Entity/Exercice";
import { makeUserFaker, User } from "../../../Domain/Entity/User";
import { makeWorkoutTemplateFaker, WorkoutTemplate } from "../../../Domain/Entity/WorkoutTemplate";
import { WorkoutTemplateService } from "../../../Domain/Service/DWorkoutTemplateService";

const user = makeUserFaker();

const workoutTemplateService = new WorkoutTemplateService();

test("Test can create WorkoutTemplate valide pour publique", () => {
  expect(workoutTemplateService.canCreateWorkoutTemplate(makeWorkoutTemplateFaker()));
});

test("Test can create WorkoutTemplate valide pour privé", () => {
  expect(workoutTemplateService.canCreateWorkoutTemplate(makeWorkoutTemplateFaker({name: "Push putain", is_public: false})));
});

test("Test can create WorkoutTemplate invalide name with injure", () => {
  expect(() => workoutTemplateService.canCreateWorkoutTemplate(makeWorkoutTemplateFaker({name: "Push putain", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});

test("Test can create WorkoutTemplate invalide name with Maj injure", () => {
  expect(() => workoutTemplateService.canCreateWorkoutTemplate(makeWorkoutTemplateFaker({name: "Push PuTAiN", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});

test("Test can update WorkoutTemplate valide pour publique", () => {
  expect(workoutTemplateService.canUpdateWorkoutTemplate(makeWorkoutTemplateFaker()));
});

test("Test can update WorkoutTemplate valide pour privé", () => {
  expect(workoutTemplateService.canUpdateWorkoutTemplate(makeWorkoutTemplateFaker({name: "Push putain", is_public: false})));
});

test("Test can update WorkoutTemplate invalide name with injure", () => {
  expect(() => workoutTemplateService.canUpdateWorkoutTemplate(makeWorkoutTemplateFaker({name: "Push putain", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});

test("Test can update WorkoutTemplate invalide name with Maj injure", () => {
  expect(() => workoutTemplateService.canUpdateWorkoutTemplate(makeWorkoutTemplateFaker({name: "Push PuTAiN", is_public: true}))).toThrow(
    "Vous ne pouvez pas mettre d'injure dans une ressource publique"
  );
});
