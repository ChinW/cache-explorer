import { HazelcastUtils } from '../../lib/hazelcastUtils';
import { IncomingMessage, ServerResponse } from 'http';
import querystring from 'querystring';
import { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const query: CacheQuery = JSON.parse(req.body);
    console.log('query', query);
    const data = await HazelcastUtils.getValues(query);
    res.status(200).json(data)
}