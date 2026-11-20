import { Muscle } from "../../../Domain/Entity/Muscle"
import { User } from "../../../Domain/Entity/User"
import { WorkoutTemplate } from "../../../Domain/Entity/WorkoutTemplate"
import { WorkoutTemplateService } from "../../../Domain/Service/WorkoutTemplateService"

const user = new User("Max", "max+test@gmail.com", "P@ssword1234")

const workoutTemplateService = new WorkoutTemplateService()

test("Test can create WorkoutTemplate valide pour public", () => {
    expect(workoutTemplateService.canCreateWorkoutTemplate(new WorkoutTemplate(1, "Push", user, true)))
})

test("Test can create WorkoutTemplate valide pour privé", () => {
    expect(workoutTemplateService.canCreateWorkoutTemplate(new WorkoutTemplate(1, "Push putain", user, false)))
})

test("Test can create WorkoutTemplate invalide name with injure", () => {
    expect(() => workoutTemplateService.canCreateWorkoutTemplate(new WorkoutTemplate(1, "Push putain", user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})

test("Test can create WorkoutTemplate invalide name with Maj injure", () => {
    expect(() => workoutTemplateService.canCreateWorkoutTemplate(new WorkoutTemplate(1, "Push Putain", user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})

test("Test can update WorkoutTemplate valide pour public", () => {
    expect(workoutTemplateService.canUpdateWorkoutTemplate(new WorkoutTemplate(1, "Push", user, true)))
})

test("Test can update WorkoutTemplate valide pour privé", () => {
    expect(workoutTemplateService.canUpdateWorkoutTemplate(new WorkoutTemplate(1, "Push putain", user, false)))
})

test("Test can update WorkoutTemplate invalide name with injure", () => {
    expect(() => workoutTemplateService.canUpdateWorkoutTemplate(new WorkoutTemplate(1, "Push putain", user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})

test("Test can update WorkoutTemplate invalide name with Maj injure", () => {
    expect(() => workoutTemplateService.canUpdateWorkoutTemplate(new WorkoutTemplate(1, "Push Putain", user, true))).toThrow("Vous ne pouvez pas mettre d'injure dans une ressource public")
})