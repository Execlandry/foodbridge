const loginFields = [
  {
    labelText: "Email address",
    labelFor: "email-address",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Password",
  },
];

const signupFields = [
  {
    labelText: "First Name",
    labelFor: "first_name",
    id: "first_name",
    name: "first_name",
    type: "text",
    autoComplete: "given-name",
    isRequired: true,
    placeholder: "First Name",
  },
  {
    labelText: "Last Name",
    labelFor: "last_name",
    id: "last_name",
    name: "last_name",
    type: "text",
    autoComplete: "family-name",
    isRequired: true,
    placeholder: "Last Name",
  },
  {
    labelText: "Email address",
    labelFor: "email",
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Email address",
  },
  {
    labelText: "Password",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "new-password",
    isRequired: true,
    placeholder: "Password",
  },
  {
    labelText: "Confirm Password",
    labelFor: "confirm_password",
    id: "confirm_password",
    name: "confirm_password",
    type: "password",
    autoComplete: "new-password",
    isRequired: true,
    placeholder: "Confirm Password",
  }
];


export { loginFields, signupFields };
