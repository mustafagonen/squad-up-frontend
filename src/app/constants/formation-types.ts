export interface FormationPosition {
    type: string;
    order: number;
}

export type FormationMap = {
    [formation: string]: FormationPosition[];
};