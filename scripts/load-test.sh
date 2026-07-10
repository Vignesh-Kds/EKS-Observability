#!/bin/bash

set -e

#############################################
# Application Load Testing Script
# Project: EKS Multi-Service Application
#############################################

TARGET_URL=${1:-http://localhost}
DURATION=${2:-5m}
VUS=${3:-50}


echo "===================================="
echo "Starting Load Test"
echo "===================================="

echo "Target URL : ${TARGET_URL}"
echo "Duration   : ${DURATION}"
echo "Virtual Users : ${VUS}"


#############################################
# Check k6 Installation
#############################################

if ! command -v k6 &> /dev/null
then

    echo "k6 is not installed"

    echo ""
    echo "Install k6:"
    echo "https://k6.io/docs/getting-started/installation/"

    exit 1

fi



#############################################
# Create Temporary k6 Script
#############################################

TEST_FILE="/tmp/load-test.js"


cat <<EOF > ${TEST_FILE}

import http from 'k6/http';
import { check, sleep } from 'k6';


export const options = {

    stages: [

        {
            duration: "1m",
            target: ${VUS}
        },

        {
            duration: "${DURATION}",
            target: ${VUS}
        },

        {
            duration: "1m",
            target: 0
        }

    ],


    thresholds: {

        http_req_failed: [
            'rate<0.01'
        ],

        http_req_duration: [
            'p(95)<500'
        ]

    }

};



export default function () {


    let response = http.get(
        "${TARGET_URL}"
    );


    check(response, {

        "status is 200":
            (r) => r.status === 200,


        "response time < 500ms":
            (r) => r.timings.duration < 500

    });


    sleep(1);

}

EOF



#############################################
# Run Load Test
#############################################

echo ""
echo "Running k6 Test..."

k6 run ${TEST_FILE}



#############################################
# Cleanup
#############################################

rm -f ${TEST_FILE}



echo ""
echo "===================================="
echo "Load Test Completed"
echo "===================================="