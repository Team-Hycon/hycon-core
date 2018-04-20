declare module 'merkle-lib'
{
    type Concatable = Buffer | Uint8Array
    // Consensus Critical
    function merkle(values: Concatable[], hashFunction: (value: Concatable) => Concatable): Concatable[]

    export = merkle
}