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
} from '@react-email/components';

interface ExampleEmailProps {
  name: string;
  actionUrl?: string;
}

export function ExampleEmail({ name, actionUrl = 'https://example.com' }: ExampleEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our app</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-xl rounded-lg bg-white p-10 shadow-lg">
            <Heading className="mb-4 text-2xl font-bold text-gray-900">Welcome, {name}!</Heading>
            <Text className="mb-4 text-base leading-6 text-gray-600">
              Thank you for signing up. We are excited to have you on board.
            </Text>
            <Text className="mb-6 text-base leading-6 text-gray-600">
              Click the button below to get started with your account.
            </Text>
            <Section className="text-center">
              <Button
                href={actionUrl}
                className="inline-block rounded-md bg-black px-6 py-3 text-sm font-medium text-white no-underline"
              >
                Get Started
              </Button>
            </Section>
            <Text className="mt-8 text-sm text-gray-500">
              If you did not create an account, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ExampleEmail;
