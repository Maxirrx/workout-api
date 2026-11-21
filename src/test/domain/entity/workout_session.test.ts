import { makeUserFaker } from "../../../Domain/Entity/User";
import { WorkoutSession } from "../../../Domain/Entity/WorkoutSession";
import { makeWorkoutTemplateFaker, WorkoutTemplate } from "../../../Domain/Entity/WorkoutTemplate";

const user = makeUserFaker();
const workout_template = makeWorkoutTemplateFaker();

test("Workout Session valide pas terminé", () => {
  expect(new WorkoutSession(user, workout_template, new Date(2005, 3, 23), false)).toBeInstanceOf(WorkoutSession);
});

test("Workout Session valide terminé", () => {
  expect(new WorkoutSession(user, workout_template, new Date(2005, 3, 23), true)).toBeInstanceOf(WorkoutSession);
});

test("Workout Session valide peut être planifié dans le future", () => {
  expect(new WorkoutSession(user, workout_template, new Date(2222, 3, 23), false)).toBeInstanceOf(WorkoutSession);
});
test("Workout Session invalide ne peut pas être terminé dans le future", () => {
  expect(() => new WorkoutSession(user, workout_template, new Date(2222, 3, 23), true)).toThrow(
    `Vous ne pouvez pas terminer une séance qui est planifié pour le ${new Date(2222, 3, 23).toString()}`
  );
});
