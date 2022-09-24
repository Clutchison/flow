const MAX_SIZE = 2000;

export const replyLong = async (int, msg) => {
  if (msg.length === 0) return;
  if (msg.length < MAX_SIZE) {
    await int.reply(msg);
    return;
  }
  const msgs = chunkString(msg);
  await int.reply(msgs[0]);
  msgs.slice(1).forEach(async subMsg => await int.followUp(subMsg));
}

const chunkString = (str, length = MAX_SIZE) => str.match(new RegExp('(.|[\r\n]){1,' + length + '}', 'g'))

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const jlog = (obj, title, replacer) => {
  if (title) console.log('-----' + title + '-----');
  console.log(JSON.stringify(obj, replacer, 4));
};