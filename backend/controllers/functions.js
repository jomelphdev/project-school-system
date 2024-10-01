export default function check_token(token){
  if (!token) return 403;
  else if (token !== valid_token) return 401;
  return 200;
}