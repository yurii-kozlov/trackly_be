export const emailVerificationMailgenContent = (username: string, verificationUrl: string) => {
  return {
    body: {
      action: {
        button: {
          color: '#22bc66',
          link: verificationUrl,
          text: 'Verify your email',
        },
        instructions: 'To verify your email, please click the following button',
      },
      intro: "Welcome to our Trackly App! We're excited to have you on board!",
      name: username,
      outro: "Need help or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const forgotPasswordMailgenContent = (username: string, passwordResetUrl: string) => {
  return {
    body: {
      action: {
        button: {
          color: '#22bc66',
          link: passwordResetUrl,
          text: 'Reset your password',
        },
        instructions: 'To reset your password click the following button or link',
      },
      intro: 'We have recieved a request to reset the password of your account',
      name: username,
      outro: "Need help or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
