export class MemoModel {
    constructor(public id: bigint | number,
                public lastModif: Date,
                public title: string,
                public content: string,
                public reminderByDate: [{id: bigint | number, reminderDate: Date}],
                public reminderByDay: {id: bigint | number, monday: boolean, tuesday: boolean,
                    wednesday: boolean, thursday: boolean, friday: boolean, saturday: boolean, sunday: boolean}) {
    }
}
