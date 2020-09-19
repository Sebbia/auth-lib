import Credentials from './Credentials';

export default interface AuthRPC {
  call(cmd: string, variables: Credentials | {}): Promise<Credentials>;
}
