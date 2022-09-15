#/bin/sh

MODULE=server

#########################################################################################################
#########################################################################################################
#########################################################################################################
small_box() {
    local length=${#1}
    local var=""
    for (( i = 1; i <= 62-length; i++ ))
    do
        var=$var" "
    done

    echo ""
    echo "+-----------------------------------------------------------------+"
    echo "|   $1$var|"
    echo "+-----------------------------------------------------------------+"
}

big_box() {
    local length=${#1}
    local var=""
    for (( i = 1; i <= 62-length; i++ ))
    do
        var=$var" "
    done

    echo ""
    echo "###################################################################"
    echo "#                                                                 #"
    echo "#   $1$var#"
    echo "#                                                                 #"
    echo "###################################################################"
}

check_error() {
    result=`echo $?`
    if [ $result -ne 0 ]; then
        echo ""
        echo ""
        echo "??????????????????????????????????????????????????????????????"
        echo "[ERROR] Error is detected."
        ############################
        #read y_or_n
        #if [ -n "$y_or_n" ] && [ $y_or_n != "y" ]; then
        #    exit 1
        #fi

        ############################
        #while read y_or_n
        #do
        #    if [ "$y_or_n" = "n" ]; then
        #        echo
        #        echo
        #        echo "Installation is cancelled"
        #        echo
        #        echo
        #        exit 1
        #    elif [ "$y_or_n" = "y" ]; then
        #        break;
        #    fi
        #done
        echo
        echo
        exit 1
    fi
}

print_help() {
    echo ""
    echo "Usage:    ${0} target"
    echo ""
    echo "  target: stage"
    echo "          prod"
    echo ""
}


#########################################################################################################
#########################################################################################################
#########################################################################################################
TARGET=${1}
TAG="dev"
DOCKERFILE="Dockerfile"
if [ "${TARGET}" = "stage" ]; then
    TAG="stage"
    DOCKERFILE="Dockerfile"
elif [ "${TARGET}" = "prod" ]; then
    TAG="latest"
    DOCKERFILE="Dockerfile"
else
    print_help
    exit
fi

echo "target:       ${TARGET}"


#########################################################################################################
#########################################################################################################
#########################################################################################################
############################
big_box "Start"

############################
docker build --platform=linux/amd64 --tag dtb/$MODULE:${TAG} .
check_error
small_box "docker build done"

############################
docker tag dtb/$MODULE:${TAG} 268788539198.dkr.ecr.ap-northeast-2.amazonaws.com/dtb/$MODULE:${TAG}
check_error
small_box "docker tag done"

############################
sudo aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 268788539198.dkr.ecr.ap-northeast-2.amazonaws.com
check_error
small_box "docker login done"

############################
echo ""
echo ""
echo ""
echo "Are you ready to push docker images for ${TARGET}? [y OR n]"
while read y_or_n
do
    if [ "$y_or_n" = "n" ]; then
        echo
        echo
        echo "It is cancelled"
        echo
        echo
        exit 1
    elif [ "$y_or_n" = "y" ]; then
        break;
    fi
done
sudo docker push 268788539198.dkr.ecr.ap-northeast-2.amazonaws.com/dtb/$MODULE:${TAG}
check_error
small_box "docker push done"

############################
big_box "Finish"


