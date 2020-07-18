export interface ImportConfig {
    path: string;
    exportedName: string;
}
export interface ListenerImportConfig {
    importConfig: ImportConfig;
    type: string;
}
