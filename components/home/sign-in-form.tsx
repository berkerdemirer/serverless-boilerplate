export function SignInForm() {
  return (
    <div className="mx-auto flex w-96 flex-col gap-8">
      <p>Log in to see the numbers</p>
      <a href="/sign-in">
        <button className="bg-foreground text-background rounded-md px-4 py-2">Sign in</button>
      </a>
      <a href="/sign-up">
        <button className="bg-foreground text-background rounded-md px-4 py-2">Sign up</button>
      </a>
    </div>
  );
}
