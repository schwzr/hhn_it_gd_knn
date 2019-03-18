
/**
 * Nutze diese Datei für benutzerdefinierte Funktionen und Blöcke.
 * Weitere Informationen unter https://makecode.calliope.cc/blocks/custom
 */


//% color=190 weight=100 icon="\uf1ec" block="ml_knn"
namespace ml_knn {
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



//% color=190 weight=100 icon="\uf1ec" block="ml_dt"
namespace ml_dt {
    let instance: SG = new SG();
    let changed: boolean = true;

    //% block
    export function train(temperature: number, location: Location): void {
        instance.add(temperature, location);
        changed = true;
    }

    //% block
    export function predict(temperature: number): Location {
        if (changed) {
            instance.train();
            changed = false;
        }
        return instance.predict(temperature);
    }
}

enum Location {
    INSIDE,
    OUTSIDE
}

//% fixedInstances
//% blockNamespace=ml_knn
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

//% fixedInstances
//% blockNamespace=ml_dt
class SG {
    list: number[][];
    number_of_classes: number;
    border: number;
    class_0_is_lower_then_border: boolean;
    constructor() {
        this.list = [];
        this.number_of_classes = 2;
        this.border = 0;
        this.class_0_is_lower_then_border = true;
    }

    add(nbr: number, cls: number) {
        this.list.push([nbr, cls]);
    }

    train() {
        // todo
        let calc_list: number[][] = [];
        // remove nbr from each item
        this.list.forEach(function (element) {
            calc_list.push([element[0], element[1]]);
        });
        calc_list.sort(function (a, b) {
            return a[0] - b[0];
        });
        // console.log(calc_list);
        let total_classification_error = calc_list.length;
        let split_before: number = 0;
        for (let i = 0; i <= calc_list.length; i++) {
            // before
            let count_0_before = 0;
            let count_1_before = 0;
            for (let j = 0; j < i; j++) {
                if (calc_list[j][1] == 0) {
                    count_0_before++;
                } else {
                    count_1_before++;
                }
            }
            // after
            let count_0_after = 0;
            let count_1_after = 0;
            for (let j = i; j < calc_list.length; j++) {
                if (calc_list[j][1] == 0) {
                    count_0_after++;
                } else {
                    count_1_after++;
                }
            }
            // combined
            let iteration_class_0_is_lower_then_border = true;
            let iteration_classification_error = 0;
            if ((count_0_after + count_1_after > count_0_before + count_1_before) || (count_0_before == count_1_before)) {
                if (count_0_after > count_1_after) {
                    iteration_class_0_is_lower_then_border = false;
                }
            } else {
                if (count_0_before < count_1_before) {
                    iteration_class_0_is_lower_then_border = false;
                }
            }

            if (iteration_class_0_is_lower_then_border) {
                iteration_classification_error = count_1_before + count_0_after;
            } else {
                iteration_classification_error = count_0_before + count_1_after;
            }

            if (iteration_classification_error < total_classification_error) {
                total_classification_error = iteration_classification_error;
                this.class_0_is_lower_then_border = iteration_class_0_is_lower_then_border;
                split_before = i;
                // console.log("Found better solution: split_before:" +split_before + ", <:" + this.class_0_is_lower_then_border + ", CE:" + total_classification_error);
            } else {
                // console.log("Found no better solution: split_before:" +i + ", <:" + iteration_class_0_is_lower_then_border + ", CE:" + iteration_classification_error);
            }

        }

        if (split_before == 0 || split_before == calc_list.length) {
            // console.log("no split in dataset...");
            if (split_before == 0) {
                this.border = -10000; // TODO replace with valid borders
            } else {
                this.border = 10000; // TODO replace with valid borders
            }
        } else {
            this.border = (calc_list[split_before - 1][0] + calc_list[split_before][0]) / 2;
            // console.log("New border is " + this.border);
        }

    }

    predict(nbr: number): number {
        return ((this.class_0_is_lower_then_border && (nbr < this.border)) || (!this.class_0_is_lower_then_border && (nbr >= this.border))) ? 0 : 1;
    }

}
