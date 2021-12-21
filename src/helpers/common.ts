export const getArgs = (param: any) => {
    // First match everything inside the function argument parens.
  const args = param.toString().match(/.*?\(([^)]*)\)/) ? param.toString().match(/.*?\(([^)]*)\)/)[1] : '';
  // Split the arguments string into an array comma delimited.
  return args
    .split(',')
    .map((arg: string) => {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, '').trim();
    })
    .filter((arg: any) => {
      // Ensure no undefined values are added.
      return arg;
    });
}