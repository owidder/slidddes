import * as _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './TotalRewards.css';

const MIN_REWARD = 100;
const MAX_REWARD = 1000;
const REWARD_MODULO = MIN_REWARD + MAX_REWARD;

const _nextReward = (position, currentBlockNumber) => {
    const ageOfLastMove = currentBlockNumber - position.blockNumber;
    const nextReward = (ageOfLastMove % REWARD_MODULO) - MIN_REWARD;

    return nextReward;
}

export class TotalRewards extends Component {

    positiveOrNegativeClass(nextReward) {
        if(this.props.currentBlockNumber > 0) {
            if(nextReward > 0) {
                return "positive";
            }
            else if(nextReward < 0) {
                return "negative";
            }
            return "";
        }

        return "";
    }

    renderRow(position) {
        const nextReward = _nextReward(position, this.props.currentBlockNumber);
        return (
            <tr key={position.id}
                className={position.id === this.props.selectedId ? "selected" : ""}>
                <td>{position.id}</td>
                <td>{position.totalReward}</td>
                <td className={this.positiveOrNegativeClass(nextReward)}>{this.props.currentBlockNumber > 0 ? nextReward : '-'}</td>
                <td>{this.props.currentBlockNumber > 0 ? this.props.currentBlockNumber - position.blockNumberOfBirth : '-'}</td>
            </tr>
        )
    }

    sortedPositionArray() {
        const positionArray = _.values(this.props.idToPosition);
        positionArray.sort((a, b) => {
            return Number(a.totalReward) < Number(b.totalReward);
        });

        return positionArray;
    }

    render() {
        return (
            <div className={"chaintable " + this.props.classNames
            }>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>total rewards</th>
                            <th>next reward</th>
                            <th>age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.sortedPositionArray()
                            .filter(position => !_.isEmpty(position.id))
                            .map((position) => this.renderRow(position))}
                    </tbody>
                </table>
            </div>
        );
    }
}

TotalRewards.propTypes = {
    idToPosition: PropTypes.object,
    currentBlockNumber: PropTypes.number,
    selectedId: PropTypes.string,
    classNames: PropTypes.string,
}

const render = (selector, selectedId, currentBlockNumber, idToPosition, classNames) => {
    ReactDOM.render(
        <TotalRewards idToPosition={idToPosition} selectedId={selectedId} currentBlockNumber={currentBlockNumber} classNames={classNames}/>,
        document.querySelector(selector)
    )

}

const animate = (selector, selectedId, currentBlockNumber, idToPosition, classNames) => {
    const index = _.random(0, 10);
    let nextSelectedId = selectedId;
    if(index < 3) {
        const key = _.keys(idToPosition)[index];
        const position = idToPosition[key];
        position.totalReward += _nextReward(position, currentBlockNumber);
        position.blockNumber = currentBlockNumber;
        nextSelectedId = position.id;
    }
    render(selector, nextSelectedId, currentBlockNumber+1, idToPosition, classNames);
    setTimeout(() => {
        animate(selector, nextSelectedId, currentBlockNumber+1, idToPosition, classNames);
    }, 2000)
}

const create = (selector, names, classNames = "normal") => {
    const startBlockCounter = 10000;
    const idToPosition = {};
    names.forEach((name) => {
        idToPosition[name] = {
            id: name,
            blockNumberOfBirth: startBlockCounter - _.random(0, 5000),
            blockNumber: startBlockCounter - _.random(0, 1000),
            totalReward: _.random(-100, 1000)
        }
    })

    animate(selector, "snk", startBlockCounter, idToPosition, classNames);
}

export const totalRewards = {
    create
}