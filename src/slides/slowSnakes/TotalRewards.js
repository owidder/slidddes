import * as _ from 'lodash';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './TotalRewards.css';

const MIN_REWARD = 10;

const _nextReward = (position, currentBlockNumber) => {
    const ageOfLastMove = currentBlockNumber - position.blockNumber;
    const nextReward = ageOfLastMove - MIN_REWARD;

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
            <div className="chaintable">
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
}

const render = (selector, selectedId, currentBlockNumber, idToPosition) => {
    ReactDOM.render(
        <TotalRewards idToPosition={idToPosition} selectedId={selectedId} currentBlockNumber={currentBlockNumber}/>,
        document.querySelector(selector)
    )

}

const animate = (selector, selectedId, currentBlockNumber, idToPosition) => {
    const index = _.random(0, 10);
    let nextSelectedId = selectedId;
    if(index < 3) {
        const key = _.keys(idToPosition)[index];
        const position = idToPosition[key];
        position.totalReward += _nextReward(position, currentBlockNumber);
        position.blockNumber = currentBlockNumber;
        nextSelectedId = position.id;
    }
    render(selector, nextSelectedId, currentBlockNumber+1, idToPosition);
    setTimeout(() => {
        animate(selector, nextSelectedId, currentBlockNumber+1, idToPosition);
    }, 2000)
}

const create = (selector, startBlockCounter) => {
    const snk = {
        id: "snk",
        blockNumberOfBirth: startBlockCounter - 5322,
        blockNumber: startBlockCounter,
        totalReward: 0
    }
    const slw = {
        id: "slw",
        blockNumberOfBirth: startBlockCounter - 72521,
        blockNumber: startBlockCounter - 32,
        totalReward: 0
    }
    const fcu = {
        id: "fcu",
        blockNumberOfBirth: startBlockCounter - 19937,
        blockNumber: startBlockCounter - 355,
        totalReward: 0
    }
    const idToPosition = {snk, slw, fcu};
    animate(selector, "snk", startBlockCounter, idToPosition);
}

export const totalRewards = {
    create
}