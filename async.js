'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    // асинхронная магия
    return new Promise(resolve => {
        let result = [];
        if (jobs.length === 0) {
            resolve(result);
        }
        let count = 0;
        for (let i = 0; i < parallelNum; i++) {
            startJob(jobs[count], count++);
        }

        function startJob(job, index) {
            let answer = data => results(data, index);
            new Promise((resolveRes, rejectRes) => {
                job().then(resolveRes, rejectRes);
                setTimeout(rejectRes, timeout, new Error('Promise timeout'));
            }).then(answer)
                .catch(answer);
        }

        function results(data, index) {
            result[index] = data;
            if (result.length === jobs.length) {
                resolve(result);
            }

            if (count < jobs.length) {
                startJob(jobs[count], count++);
            }
        }
    });
}
