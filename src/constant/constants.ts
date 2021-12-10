interface Data {
    id: number;
    transactionHash: string;
    type: string;
    amount: string;
    date: string;
    status: string;
}
interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

const createData = (
    id: number,
    transactionHash: string,
    type: string,
    amount: string,
    date: string,
    status: string
) => {
    return { id, transactionHash, type, amount, date, status };
};

export const rows = [
    createData(
        1,
        '0xxxxakhfkdhfwkh',
        'Stake',
        '$ 223 ',
        '15-11-2021',
        'Completed'
    ),
    createData(
        2,
        '0xxxxakhfksdfkh',
        'Withdraw',
        '$ 234 ',
        '27-11-2021',
        'pending'
    ),
    createData(
        3,
        '0xxxxakhfkasdfwkh',
        'Stake',
        '$ 554 ',
        '09-11-2021',
        'pending'
    ),
    createData(
        4,
        '0xxxxakhdaafwkh',
        'Claim',
        '$ 489 ',
        '15-11-2021',
        'pending'
    ),
    createData(
        5,
        '0xxxxakhfkasdfwkh',
        'Stake',
        '$ 543 ',
        '10-11-2021',
        'Withdraw'
    ),
    createData(
        6,
        '0xxxxakhfkadfkh',
        'Stake',
        '$ 543 ',
        '23-11-2021',
        'pending'
    ),
    createData(
        7,
        '0xxxxakhfkdhfwkgd',
        'Stake',
        '$ 223 ',
        '21-11-2021',
        'pending'
    ),
    createData(
        8,
        '0xxxxakhfkdhfwkh',
        'Stake',
        '$ 123 ',
        '20-11-2021',
        'Completed'
    ),
];

export const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        numeric: false,
        disablePadding: false,
        label: 'ID',
    },
    {
        id: 'transactionHash',
        numeric: true,
        disablePadding: false,
        label: 'Transaction Hash',
    },
    {
        id: 'type',
        numeric: true,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'Amount',
    },
    {
        id: 'date',
        numeric: true,
        disablePadding: false,
        label: 'Date',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    },
];



export enum THEME_MODE {
    LIGHT = 'light',
    DARK = 'dark'
}

