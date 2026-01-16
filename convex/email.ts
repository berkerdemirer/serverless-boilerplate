"use node";

import { Resend } from "resend";
import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";

/**
 * Send an email using Resend.
 */
export const send = action({
  args: {
    to: v.union(v.string(), v.array(v.string())),
    subject: v.string(),
    html: v.string(),
    from: v.optional(v.string()),
    replyTo: v.optional(v.union(v.string(), v.array(v.string()))),
  },
  returns: v.union(
    v.object({ id: v.string() }),
    v.object({ error: v.string() })
  ),
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: args.from ?? "onboarding@resend.dev",
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { error: error.message };
    }

    return { id: data!.id };
  },
});

/**
 * Internal action for sending emails from other Convex functions.
 */
export const sendInternal = internalAction({
  args: {
    to: v.union(v.string(), v.array(v.string())),
    subject: v.string(),
    html: v.string(),
    from: v.optional(v.string()),
    replyTo: v.optional(v.union(v.string(), v.array(v.string()))),
  },
  returns: v.union(
    v.object({ id: v.string() }),
    v.object({ error: v.string() })
  ),
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: args.from ?? "onboarding@resend.dev",
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { error: error.message };
    }

    return { id: data!.id };
  },
});
