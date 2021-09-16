export function ClassNameFirstLetter(object: object): string {
    return object.constructor.toString().substring(6, 7); // = 'class [C]lassName'
}
