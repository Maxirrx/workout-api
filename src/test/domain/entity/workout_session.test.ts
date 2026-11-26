import { makeUserFaker } from "../../../Domain/Entity/User";
import { makeWorkoutSessionFaker, WorkoutSession } from "../../../Domain/Entity/WorkoutSession";
import { makeWorkoutTemplateFaker, WorkoutTemplate } from "../../../Domain/Entity/WorkoutTemplate";

const user = makeUserFaker();
const workout_template = makeWorkoutTemplateFaker();

test("Workout Session valide pas terminé", () => {
  expect(makeWorkoutSessionFaker({is_end: false})).toBeInstanceOf(WorkoutSession);
});

test("Workout Session valide terminé", () => {
  expect(makeWorkoutSessionFaker({is_end: true})).toBeInstanceOf(WorkoutSession);
});

test("Workout Session valide peut être planifié dans le future", () => {
  expect(makeWorkoutSessionFaker({date_of_workout: new Date(2222, 3, 23), is_end: false})).toBeInstanceOf(WorkoutSession);
});
test("Workout Session invalide ne peut pas être terminé dans le future", () => {
  expect(() => makeWorkoutSessionFaker({date_of_workout: new Date(2222, 3, 23), is_end: true})).toThrow(
    `Vous ne pouvez pas terminer une séance planifiée pour le ${new Date(2222, 3, 23).toString()}`
  );
});
