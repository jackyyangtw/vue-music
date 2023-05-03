import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../user";

// mock firebase auth
vi.mock("@/includes/firebase", () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve(),
  },
}));

// 測試authenticate 是否正常運作，userLoggedIn.value初始為false，authenticateAction執行後，userLoggedIn.value應為true
describe("stores", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("authenticate user", async () => {
    const userStore = useUserStore();
    expect(userStore.userLoggedIn).toBe(false);
    await userStore.authenticateAction({});
    expect(userStore.userLoggedIn).toBe(true);
  });
});
