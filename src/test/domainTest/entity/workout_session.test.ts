import { User } from "../../domain/entity/User"
import { WorkoutSession } from "../../domain/entity/WorkoutSession"
import { WorkoutTemplate } from "../../domain/entity/WorkoutTemplate"

const user = new User("Max", "max+test@gmail.com", "P@ssword1234")
const workout_template = new WorkoutTemplate(1, "PUSH", user, false)

test("Workout Session valide pas terminé", () =>{
    expect(new WorkoutSession(user, workout_template, new Date(2005, 3, 23), false)).toBeInstanceOf(WorkoutSession)
})

test("Workout Session valide terminé", () =>{
    expect(new WorkoutSession(user, workout_template, new Date(2005, 3, 23), true)).toBeInstanceOf(WorkoutSession)
})

test("Workout Session valide peut être planifié dans le future", () =>{
    expect(new WorkoutSession(user, workout_template, new Date(2222, 3, 23), false)).toBeInstanceOf(WorkoutSession)
})
test("Workout Session invalide ne peut pas être terminé dans le future", () =>{
    expect(() => new WorkoutSession(user, workout_template, new Date(2222, 3, 23), true)).toThrow(`Vous ne pouvez pas terminer une séance qui est planifié pour le ${new Date(2222, 3, 23).toString()}`)
})