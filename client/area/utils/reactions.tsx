export async function getReactions(service: string | null, setReaction: any) {
    if (service === 'gmail') {
        return [
            {label: 'Choose a reaction', value: null, onchange: setReaction},
            {label: 'Send email', value: 'send_email', onchange: setReaction},
        ];
    }
    return [];
}