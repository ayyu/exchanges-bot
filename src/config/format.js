const uncheckSymbol = '☐';
const checkSymbol = '☒';

const groupToken = '%group%';
const groupFormat = `**Group ${groupToken}**`;
const scoreToken = '%score%';
const scoreFormat = `**(${scoreToken})**`;

const groupPrefix = 'Group:';
const entryPrefix = 'Anime Given:';
const scorePrefix = 'Score:';

module.exports = {
	uncheckSymbol, checkSymbol,
	groupToken, scoreToken,
	groupFormat, scoreFormat,
	groupPrefix, entryPrefix, scorePrefix,
}