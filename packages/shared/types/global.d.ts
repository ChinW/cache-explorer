interface KV<K, V> {
    [key: string]: V
}

interface KVPair<K, V> {
    key: K,
    value: V
}

interface Dict {
    [key: string]: any
}
