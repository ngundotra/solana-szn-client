/// Show dialogue toasts for 1.5mins
const TX_DIALOG_MILLIS = 1000 * 90;

export function trimTxId(txid: string): string {
    return txid.length > 0 ? `${txid.slice(0,4)}...${txid.slice(-3)}` : '-';
}

export function showTransactionFailed(toast: any, message: string | null, txid: string | null): void {
    toast({
        title: message ?? (txid ? `${trimTxId(txid)}: failed` : "Transaction failed" ),
        status: 'error',
        location: 'bottom-left',
        isClosable: true,
        duration: TX_DIALOG_MILLIS,
    });
}

export function showTransactionSucceeded(toast: any, message: string | null, txid: string | null): void {
    toast({
        title: message ?? (txid ? `${trimTxId(txid)}: succeded` : "Transaction confirmed" ),
        status: 'success',
        location: 'bottom-left',
        isClosable: true,
        duration: TX_DIALOG_MILLIS,
    });
}

export function showTransactionSent(toast: any, message: string | null, txid: string | null): void {
    toast({
        title: message ?? (txid ? `${trimTxId(txid)}: sent` : "Transaction sent" ),
        status: 'info',
        location: 'bottom-left',
        isClosable: true,
        duration: TX_DIALOG_MILLIS,
    });
}