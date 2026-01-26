import { NextResponse } from 'next/server';

const questions = [
    {
        id: "E_I_1",
        text: "You regularly make new friends.",
        dimension: "EI",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "S_N_1",
        text: "You often spend time exploring unrealistic yet intriguing ideas.",
        dimension: "SN",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "T_F_1",
        text: "You weigh your potential options much more than the actual outcome.",
        dimension: "TF",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "J_P_1",
        text: "You often plan ahead and follow a schedule.",
        dimension: "JP",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "E_I_2",
        text: "You feel comfortable just walking up to someone you find interesting and striking up a conversation.",
        dimension: "EI",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "S_N_2",
        text: "You are more interested in what is possible than what is actual.",
        dimension: "SN",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "T_F_2",
        text: "When making a decision, you rely more on your feelings than on analysis of the situation.",
        dimension: "TF",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "J_P_2",
        text: "You prefer to act immediately rather than speculate about various options.",
        dimension: "JP",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "E_I_3",
        text: "You usually prefer to be around others rather than on your own.",
        dimension: "EI",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "S_N_3",
        text: "You become bored or lose interest when the discussion gets highly theoretical.",
        dimension: "SN",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "T_F_3",
        text: "You find it easy to empathize with a person whose experiences are very different from yours.",
        dimension: "TF",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    },
    {
        id: "J_P_3",
        text: "You usually postpone finalizing decisions for as long as possible.",
        dimension: "JP",
        options: [
            { text: "Disagree strongly", value: -3 },
            { text: "Disagree moderately", value: -2 },
            { text: "Disagree a little", value: -1 },
            { text: "Neither agree nor disagree", value: 0 },
            { text: "Agree a little", value: 1 },
            { text: "Agree moderately", value: 2 },
            { text: "Agree strongly", value: 3 }
        ]
    }
];

export async function GET() {
    // Return questions with IDs and Options as requested
    return NextResponse.json(questions);
}
