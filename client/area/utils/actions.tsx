export async function getActions(service: string | null, setAction: any) {
    if (service === 'gmail') {
        return [
            {label: 'Choose an action', value: null, onchange: setAction},
            {label: 'New email', value: 'new_email', onchange: setAction},
        ];
    }
    return [];
}
