import React from "react";
import {Pie, G2} from '@ant-design/plots';
import { useUser } from "../components/Auth";

const G = G2.getEngine('canvas');

export default function PokemonPie({userpokemon ,otherpokemon}) {

    const { username } = useUser();

    const data = getPokemonPieData(userpokemon ,otherpokemon);

    function getPokemonPieData(userpokemon , otherpokemon) {

        const PieData = [];

        PieData[0] = {
            type: username ,
            value: userpokemon.length
        }

        if(otherpokemon && otherpokemon.length != 0){

            for (let index = 0; index < otherpokemon.length; index++) {
                PieData[index+1] = {
                    type: otherpokemon[index].username,
                    value: otherpokemon[index].data.length
                }
            }
        }
        return PieData;
    }

    const pieconfig = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,

        legend: {
            layout: 'horizontal',
            position: 'top',
            offsetX: 0
        },

        label: {

            type: 'spider',
            labelHeight: 40,

            formatter: (data, mappingData) => {
                const group = new G.Group({});
                group.addShape({
                    type: 'circle',
                    attrs: {
                        x: 0,
                        y: 0,
                        width: 40,
                        height: 50,
                        r: 5,
                        fill: mappingData.color,
                    },
                });
                group.addShape({
                    type: 'text',
                    style: {
                        fontSize: 14,
                        textAlign: 'center',
                    },
                    attrs: {
                        x: 10,
                        y: 8,
                        text: `${data.type}`,
                        fill: mappingData.color,
                    },
                });
                group.addShape({
                    type: 'text',
                    attrs: {
                        x: 0,
                        y: 25,
                        text: `${(data.percent * 100).toFixed(2)}% (${data.value} pokemon) `,
                        fill: 'rgba(0, 0, 0, 0.65)',
                        fontWeight: 700,

                    },
                });
                return group;
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-highlight', //element-active
            },
        ],
    };

    return (
        <div style={{
            position: "relative",
            top: "60px",
            width: "750px",
            height: "500px",
            margin: "auto",
            background: "white",
            borderRadius: "15px"
        }}>
            <Pie {...pieconfig}/>
        </div>
    );
}
