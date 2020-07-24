import { NextApiRequest, NextApiResponse } from 'next';

console.log('cache api');

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({
        hello: 'world'
    })
}