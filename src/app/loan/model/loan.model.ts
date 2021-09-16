export class LoanModel {
    constructor(public id: bigint|Number,
                public startDate: Date,
                public endDate: Date,
                public reference: string,
                public beneficiary: string,
                public information: string,
                public comment: string,
                public reminder: Date) {
    }
}
