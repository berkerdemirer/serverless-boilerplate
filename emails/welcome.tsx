import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  actionUrl?: string;
}

export function WelcomeEmail({ name, actionUrl = "#" }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-xl rounded-lg bg-white p-10 shadow-sm">
            <Heading className="m-0 mb-5 text-2xl font-bold text-gray-900">
              Welcome, {name}!
            </Heading>
            <Text className="m-0 mb-5 text-base leading-6 text-gray-600">
              Thanks for signing up. We&apos;re excited to have you on board.
            </Text>
            <Section className="my-6">
              <Button
                href={actionUrl}
                className="rounded-md bg-black px-6 py-3 text-base font-semibold text-white no-underline"
              >
                Get Started
              </Button>
            </Section>
            <Text className="m-0 mt-8 text-sm text-gray-500">
              If you didn&apos;t create an account, you can safely ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
