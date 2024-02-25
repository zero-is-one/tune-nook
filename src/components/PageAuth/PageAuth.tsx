import { auth } from "@/firebase";
import {
  Anchor,
  Button,
  Container,
  Divider,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { updateProfile } from "firebase/auth";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { LayoutFullScreen } from "../LayoutFullScreen/LayoutFullScreen";

export const PageAuth = () => {
  const [type, toggle] = useToggle(["signIn", "create"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const [createUserWithEmailAndPassword, , loadingCreateUser, errorCreateUser] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, , loadingSignIn, errorSignIn] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = async () => {
    if (type === "create") {
      const result = await createUserWithEmailAndPassword(
        form.values.email,
        form.values.password,
      );

      if (!result || !result.user) return;

      await updateProfile(result.user, { displayName: form.values.name });
      return;
    }

    signInWithEmailAndPassword(form.values.email, form.values.password);
  };

  return (
    <LayoutFullScreen>
      <Container>
        <form
          onSubmit={form.onSubmit(() => {
            handleSubmit();
          })}
        >
          <Stack mt="md">
            <Title order={3}>
              {type === "create" ? "Sign up to Tune Nook" : "Login"}
            </Title>

            {type === "create" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="example@email.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />
            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
            <Button type="submit" loading={loadingCreateUser || loadingSignIn}>
              {type === "create" ? "Sign up" : "Login"}
            </Button>

            {errorCreateUser && <div>Error: {errorCreateUser.message}</div>}
            {errorSignIn && <div>Error: {errorSignIn.message}</div>}
            <Divider />
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="sm"
            >
              {type === "create"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
          </Stack>
        </form>
      </Container>
    </LayoutFullScreen>
  );
};
