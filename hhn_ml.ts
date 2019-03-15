
/**
 * Nutze diese Datei für benutzerdefinierte Funktionen und Blöcke.
 * Weitere Informationen unter https://makecode.calliope.cc/blocks/custom
 */


//% color=190 weight=100 icon="\uf1ec" block="ml"
namespace ml {
    let instance: KNN = new KNN(2);

    //% block
    export function train(temperature: number, location: Location): void {
        instance.train(temperature, location);
    }

    //% block
    export function predict(temperature: number): Location {
        return instance.predict(temperature, 1);
    }
}

enum Location {
    INSIDE,
    OUTSIDE
}

//% fixedInstances
//% blockNamespace=ml
class KNN {
    list: number[][];
    number_of_classes: number;
    constructor(number_of_classes: number) {
        this.list = [];
        this.number_of_classes = number_of_classes;
    }
    train(nbr: number, cls: number) {
        this.list.push([nbr, cls]);
    }

    predict(nbr: number, k: number): number {
        // copy list
        let calc_list: number[][] = [];
        // remove nbr from each item
        this.list.forEach(function (element) {
            calc_list.push([Math.abs(element[0] - nbr), element[1]]);
        });
        calc_list.sort(function (a, b) {
            return a[0] - b[0];
        });

        // for debugging on pc: console.log(calc_list);
        // sort asc
        // take the k first classes
        // count them
        // return the most present class

        let class_occurances: number[] = [];
        for (let i: number = 0; i < this.number_of_classes; i++) {
            class_occurances.push(0);
        }

        for (let i: number = 0; i < Math.min(k, calc_list.length); i++) {
            class_occurances[calc_list[i][1]]++;
        }

        // for debugging on pc: console.log(class_occurances);


        let best_class = 0;
        let best_occurance = 0;

        for (let i: number = 0; i < this.number_of_classes; i++) {
            if (class_occurances[i] > best_occurance) {
                best_occurance = class_occurances[i];
                best_class = i;
            }
        }

        return best_class;
    }
}