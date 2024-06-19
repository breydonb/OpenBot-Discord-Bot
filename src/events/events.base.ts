import { CacheType, CommandInteraction, Interaction, InteractionType, Events } from 'discord.js';
import { OpenBotClient } from '../../index.js';

export interface InteractionCreateEvent<T extends Event<InteractionType>> {
    type: T;
    interaction: T extends InteractionType.ApplicationCommand ? CommandInteraction<CacheType> : Interaction;
}

export interface InitializeEvent<T extends Event<Events>> {
    type: T;
}

export interface Event<T> {
    type: T;
    name: string;
    once?: boolean;
    on?: boolean;
    execute(client: OpenBotClient, interaction?: InteractionType | CommandInteraction<CacheType>): void;
}

export function assertOptionalProperties<T>(event: Event<T>): Event<T> {
    return {
        ...event,
        once: event.once !== undefined ? event.once : false,
        on: event.on !== undefined ? event.on : false
    };
}